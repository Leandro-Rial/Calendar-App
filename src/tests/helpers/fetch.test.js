import { fetchConToken, fetchSinToken } from "../../helpers/fetch";

describe('Pruebas en fetch', () => {

    let token = '';
    
    test('fetchSinToken debe de funcionar', async () => {
        
        const resp = await fetchSinToken('auth', {email: 'leandro@gmail.com', password: '123456'}, 'POST');

        expect(resp instanceof Response).toBe(true);

        const body = await resp.json();

        expect(body.ok).toBe(true);

        token = body.token;
    });
    
    test('fetchConToken debe de funcionar', async () => {
        localStorage.setItem('token', token);

        const resp = await fetchConToken('events/611ea5c9ca6ab4196403fddc', {}, 'DELETE')

        const body = await resp.json();

        expect(body.msg).toBe('Evento no existe por ese id')
    });
});