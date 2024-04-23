export default defineNuxtRouteMiddleware(async (to) => {
  const { fetchUser, setUser } = useDirectusAuth();
  const user = useDirectusUser();
  if (!user.value) {
    const user = await fetchUser();
    setUser(user.value);
  }
  console.log(user.value?.email, 'access')
  return 
});


//https://blog.ypertex.com/articles/nuxt-directus-authentication-middleware/