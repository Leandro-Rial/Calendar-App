import { mount } from "enzyme";
import { Provider } from "react-redux";
import cofigureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import AppRouter from "../../router/AppRouter";

const middelware = [thunk];
const mockstore = cofigureStore(middelware);
// store.dispatch = jest.fn();


describe('Pruebas en AppRouter', () => {
    
    test('debe de mostrar el espere...', () => {
        const initState = {
            auth: {
                checking: true
            }
        };
        
        const store = mockstore(initState);
        
        const wrapper = mount(
            <Provider store={store}>
                <AppRouter />
            </Provider>
        )
        
        expect(wrapper).toMatchSnapshot();
    });

    test('debe de mostrar la ruta publica', () => {
        const initState = {
            auth: {
                checking: false,
                uid: null,
            }
        };
        
        const store = mockstore(initState);
        
        const wrapper = mount(
            <Provider store={store}>
                <AppRouter />
            </Provider>
        )
        
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('.login-container').exists()).toBe(true);
    });

    test('debe de mostrar la ruta privada', () => {
        const initState = {
            calendar: {
                events: []
            },
            ui: {
                modalOpen: false
            },
            auth: {
                checking: false,
                uid: '123',
                name: 'Juan Carlos'
            }
        };
        
        const store = mockstore(initState);
        
        const wrapper = mount(
            <Provider store={store}>
                <AppRouter />
            </Provider>
        )
        
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('.calendar-screen').exists()).toBe(true);
    });
});