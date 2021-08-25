import { mount } from "enzyme";
import { Provider } from "react-redux";
import cofigureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import CalendarScreen from "../../../components/calendar/CalendarScreen";
import { types } from "../../../types/types";
import { eventSetActive } from "../../../actions/events";
import { act } from "@testing-library/react";

jest.mock("../../../actions/events", () => ({
    eventSetActive: jest.fn(),
    eventStartLoading: jest.fn(),
}))

Storage.prototype.setItem = jest.fn();

const middelware = [thunk];
const mockstore = cofigureStore(middelware);

const initState = {
    calendar: {
        events: []
    },
    auth: {
        uid: '123',
        name: 'Leandro'
    },
    ui: {
        modalOpen: false
    }
};
const store = mockstore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={store}>
        <CalendarScreen />
    </Provider>
)

describe('Pruebas en CalendarScreen', () => {
    test('debe de mostrarse correctamente', () => {
        expect(wrapper).toMatchSnapshot()
    });

    test('Pruebas con las interaccion del calendar', () => {
        const calendar = wrapper.find('Calendar')

        calendar.prop('onDoubleClickEvent')()
        
        expect(store.dispatch).toHaveBeenCalledWith({
            type: types.uiOpenModal
        })

        calendar.prop('onSelectEvent')({
            start: 'hola'
        })
        
        expect(eventSetActive).toHaveBeenCalledWith({ start: 'hola' })

        act(() => {
            calendar.prop('onView')('week');
    
            expect(localStorage.setItem).toHaveBeenCalledWith('lastView', 'week')
        })

    });
});