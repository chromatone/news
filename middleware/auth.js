export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { fetchUser, setUser } = useDirectusAuth();
  const user = useDirectusUser();

  if (!user.value) {
    const us = await fetchUser();
    setUser(us.value);
  }

  // if (!user.value?.email) {
  //   return navigateTo("/auth/");
  // }

  if (!user.value?.email || !user.value?.member?.[0]) {
    return navigateTo('/membership/subscribe')
  }
});
