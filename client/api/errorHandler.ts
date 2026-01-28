import Cookies from "js-cookie"
import { toast } from "react-hot-toast"

export function handleApiError(message?: string) {
    if (!message) {
        toast.error("Um erro inesperado ocorreu. Tente novamente mais tarde.")
        return
    }

    switch (message) {
        case "Invalid credentials":
        case "The email address or password is incorrect.":
            toast.error("O email e/ou a senha estão incorretos.")
            break

        case "This email address is already in use.":
            toast.error("Este email já está em uso. Tente outro.")
            break

        case "Jira integration is not configured for this user":
            toast.error("A integração com o Jira não está configurada para este usuário.")
            break

        case "Unauthorized":
            Cookies.remove("access-token")
            toast.error("Sua sessão expirou. Faça login novamente.")
            break

        default:
            toast.error("Um erro inesperado ocorreu. Tente novamente mais tarde.")
            break
    }
}
