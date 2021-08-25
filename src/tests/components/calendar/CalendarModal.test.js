import { mount } from "enzyme";
import { Provider } from "react-redux";
import cofigureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import moment from "moment";
import CalendarModal from "../../../components/calendar/CalendarModal";
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from "../../../actions/events";
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker";
import { act } from "@testing-library/react";
import Swal from "sweetalert2";

jest.mock("sweetalert2", () => ({
    fire: jest.fn(),
}))

jest.mock("../../../actions/events", () => ({
    eventStartUpdate: jest.fn(),
    eventClearActiveEvent: jest.fn(),
    eventStartAddNew: jest.fn()
}))

const middelware = [thunk];
const mockstore = cofigureStore(middelware);

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlus1 = now.clone().add(1, 'hours');

const initState = {
    calendar: {
        events: [],
        activeEvent: {
            title: 'Helouda',
            notes: 'asdasdasdasd',
            start: now.toDate(),
            end: nowPlus1.toDate()
        }
    },
    auth: {
        uid: '123',
        name: 'Leandro'
    },
    ui: {
        modalOpen: true
    }
};
const store = mockstore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={store}>
        <CalendarModal />
    </Provider>
)


describe('Pruebas en CalendarModal', () => {

    beforeEach(() => jest.clearAllMocks())

    test('debe de mostrar el modal', () => {
        
        // expect(wrapper.find('.modal').exists()).toBe(true)
        expect(wrapper.find('Modal').prop('isOpen')).toBe(true);

    });

    test('debe de llamar la accion de actualizary cerrar el modal', () => {
        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        })
        
        expect(eventStartUpdate).toHaveBeenCalledWith(initState.calendar.activeEvent)
        expect(eventClearActiveEvent).toHaveBeenCalled()
    });
    
    test('debe de mostrar error si falta titulo', () => {
        
        
        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        })
        
        expect(wrapper.find('input[name="title"]').hasClass('is-invalid')).toBe(true)

    });

    test('debe de crear un nuevo evento', () => {
        
        const initState = {
            calendar: {
                events: [],
                activeEvent: null
            },
            auth: {
                uid: '123',
                name: 'Leandro'
            },
            ui: {
                modalOpen: true
            }
        };
        const store = mockstore(initState);
        store.dispatch = jest.fn();
        
        const wrapper = mount(
            <Provider store={store}>
                <CalendarModal />
            </Provider>
        )

        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name:'title',
                value: 'Pruebas'
            }
        })
        
        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        })
        
        expect(eventStartAddNew).toHaveBeenCalledWith({"end": expect.anything(), "notes": "", "start": expect.anything(), "title": "Pruebas"})
        
        expect(eventClearActiveEvent).toHaveBeenCalled()
    });
    
    test('debe de validar las fechas', () => {
        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name:'title',
                value: 'Pruebas'
            }
        })
        
        const hoy = new Date();

        act(() => {
            wrapper.find(DateTimePicker).at(1).prop('onChange')(hoy)
        });

        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        })

        expect(Swal.fire).toHaveBeenCalledWith(
            "Error", "La fecha fin debe ser mayor a la fecha de inicio", "error"
        )

    });
});