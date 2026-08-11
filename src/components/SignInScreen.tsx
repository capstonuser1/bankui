export function SignInScreen() {
  return (
    <section className="sign-in-screen">
      <h2>Sign In</h2>
      <p>Please sign in to access your accounts and transfer funds.</p>
      <a href="/oauth2/authorization/code/bank-auth" className="sign-in-button">
        Sign In
      </a>
    </section>
  );
}
