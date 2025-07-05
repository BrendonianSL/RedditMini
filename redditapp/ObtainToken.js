const client_key = import.meta.env.VITE_REDDIT_KEY;
const client_secret = import.meta.env.VITE_REDDIT_SECRET;

export async function obtainToken() {
    //Obtains Token
    const token = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_key + ':' + client_secret)
        },
        body: 'grant_type=client_credentials'
    })
    const data = await token.json();
    return data.access_token;
}