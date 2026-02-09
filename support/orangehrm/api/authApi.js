/**
 * Отправка POST на auth/validate из контекста страницы (fetch).
 * Куки сессии сохраняются в браузере.
 * @returns {Promise<boolean>} true, если ответ успешный
 */
export async function submitLoginViaFetch(page, { validateUrl, token, username, password }) {
    return page.evaluate(
        async ({ url, token, username, password }) => {
            const body = new URLSearchParams({
                _token: token,
                username,
                password,
            }).toString();
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body,
                redirect: 'follow',
                credentials: 'same-origin',
            });
            return res.ok;
        },
        { url: validateUrl, token, username, password }
    );
}
