import cofigureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';
import '@testing-library/jest-dom';
import { startChecking, startLogin, startRegister } from '../../actions/auth';
import { types } from '../../types/types';
import * as fetchModule from '../../helpers/fetch';

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}))

const middelware = [thunk];
const mockstore = cofigureStore(middelware);

const initState = {};
let store = mockstore(initState);

Storage.prototype.setItem = jest.fn();

let token = '';

describe('Pruebas en las acciones de auth', () => {

    beforeEach(() => {
        store = mockstore(initState);
        jest.clearAllMocks();
    })

    test('startLogin debe de ser correcto', async () => {
        await store.dispatch(startLogin('leandro@gmail.com', '123456'))

        const actions = store.getActions();
        
        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: expect.any(String),
                name: expect.any(String)
            }
        })

        expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String))
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number))

        token = localStorage.setItem.mock.calls[0][1]
        // console.log(localStorage.setItem.mock.calls[0][1]);
    });
    
    test('startLogin incorecto', async () => {
        await store.dispatch(startLogin('leandro@gmail.com', '1234567'))
        
        let actions = store.getActions();
        
        expect(actions).toEqual([])
        expect(Swal.fire).toHaveBeenCalledWith("Error", "Password Incorrect", "error")
        
        await store.dispatch(startLogin('leandro22@gmail.com', '123456'))
        
        actions = store.getActions();
        
        expect(Swal.fire).toHaveBeenCalledWith("Error", "El usuario no existe con ese email", "error")
    });

    test('startRegister correcto', async () => {
        fetchModule.fetchSinToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: '123124123',
                    name: 'richard',
                    token: '123kiuj12gb3b23u'
                }
            }
        }))

        await store.dispatch(startRegister('test@test.com', '123456', 'test'))

        const actions = store.getActions()

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123124123',
                name: 'richard'
            }
        })

        expect(localStorage.setItem).toHaveBeenCalledWith('token', '123kiuj12gb3b23u')
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number))
    });

    test('startChecking correcto', async () => {
        fetchModule.fetchConToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: '123124123',
                    name: 'richard',
                    token: '123kiuj12gb3b23u'
                }
            }
        }))

        await store.dispatch(startChecking());
        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123124123',
                name: 'richard'
            }
        })

        expect(localStorage.setItem).toHaveBeenCalledWith('token', '123kiuj12gb3b23u')
    });
});