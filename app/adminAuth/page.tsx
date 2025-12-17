export default function Page() {
    if (typeof window !== "undefined") {
        window.location.href = "/login"
    }
    return null
}
