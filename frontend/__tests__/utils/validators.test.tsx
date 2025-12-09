export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
}

describe("Email Validation", () => {
  test("validates valid email formats", () => {
    expect(validateEmail("test@example.com")).toBe(true)
    expect(validateEmail("user.name@domain.co.uk")).toBe(true)
  })

  test("rejects invalid email formats", () => {
    expect(validateEmail("invalid")).toBe(false)
    expect(validateEmail("@example.com")).toBe(false)
    expect(validateEmail("test@")).toBe(false)
  })
})

describe("Password Validation", () => {
  test("validates strong passwords", () => {
    expect(validatePassword("StrongPass123!")).toBe(true)
  })

  test("rejects weak passwords", () => {
    expect(validatePassword("weak")).toBe(false)
    expect(validatePassword("NoNumber!")).toBe(false)
    expect(validatePassword("NoSpecial123")).toBe(false)
  })
})
