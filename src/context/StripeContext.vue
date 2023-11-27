<script setup>
import useAuthStore from "@/stores/auth.store"
import { loadStripe } from "@stripe/stripe-js"
import axios from "axios"
import { useRoute } from "vue-router"

const route = useRoute()
const authStore = useAuthStore()
const modalRef = ref()
const stripe = ref()
const stripeElements = ref()
const stripeLoaded = ref(false)
const stripeKey = ref(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY)
const messages = ref([])
const toast = inject("toast")

const loadStripeIntent = async (data) => {
  try {
    stripe.value = await loadStripe(stripeKey.value)

    const { clientSecret, error: backendError } = await axios.post(import.meta.env.VITE_APP_LOCAL_STRIPE_SERVER + "/create-payment-intent", {
      amount: Math.round(data.price * 100),
      currency: "php",
      email: authStore.getUserData.email,
    }).then((res) => res.data);

    if (backendError) {
      messages.value.push(backendError.message);
    }
    messages.value.push(`Client secret returned.`);

    stripeElements.value = stripe.value.elements({clientSecret});
    const paymentElement = stripeElements.value.create('payment');
    paymentElement.mount("#stripe-payment-modal-content");
    const linkAuthenticationElement = stripeElements.value.create("linkAuthentication");
    linkAuthenticationElement.mount("#link-authentication-element");
   stripeLoaded.value = true
  } catch (err) {
    console.error(">>", err)
    toast.error("Stripe failed to load")
  }
}

defineExpose({
  async pay(data) {
    if (data.price > 0) {
      modalRef.value.open()
      await loadStripeIntent(data)
    }
  }
})


async function onPay() {
  if (!stripeLoaded.value) {
    return console.log("returned");
  }

  try
  {
    stripeLoaded.value = false;
    const elements = stripeElements.value;

    const { error } = await stripe.value.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      }
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      messages.value.push(error.message);
    } else {
      messages.value.push("An unexpected error occured.");
    }

    stripeLoaded.value = true;
  } catch (error) {
    console.error(error)
    toast.error("Failed to pay")
  }
}


// 
</script>

<template>
  <slot />

  <AppDialog ref="modalRef">
    <template #content>
      <div id="link-authentication-element" />
      <div id="stripe-payment-modal-content" />
    </template>
    <template #actions>
      <VBtn
        block
        color="success"
        @click="onPay"
      >
        PAY
      </VBtn>
    </template>
  </AppDialog>
</template>
