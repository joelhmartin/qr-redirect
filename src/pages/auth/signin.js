export default function SignIn() {
  return (
    <div>
      <h1>Sign In</h1>
      <form method="post" action="/api/auth/callback/credentials">
        <label>Email</label>
        <input name="email" type="text" />
        <label>Password</label>
        <input name="password" type="password" />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

