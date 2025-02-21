export async function registerUser(
  name: string,
  surname: string,
  email: string,
  password: string
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Fallback for debugging
  console.log("Fetching from:", apiUrl);

  try {
    const response = await fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, surname, email, password }),
    });

    const text = await response.text(); // Get raw text first
    console.log("Response status:", response.status, "Body:", text);

    if (!response.ok) {
      let errorData;
      if (text) {
        try {
          errorData = JSON.parse(text);
        } catch {
          throw new Error(`Server returned ${response.status}: ${text}`);
        }
      } else {
        errorData = { error: "No response body" };
      }
      throw new Error(errorData.error || "Registration failed");
    }

    return text ? JSON.parse(text) : {};
  } catch (err) {
    console.error("Fetch error:", err);
    throw err; // Re-throw to be caught in handleSubmit
  }
}