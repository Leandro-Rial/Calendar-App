import { mount } from "enzyme";
import { Provider } from "react-redux";
import cofigureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import DeleteEventFab from "../../../components/ui/DeleteEventFab";
import { eventStartDelete } from "../../../actions/events";

jest.mock("../../../actions/events", () => ({
    eventStartDelete: jest.fn()
}))

const middelware = [thunk];
const mockstore = cofigureStore(middelware);

const initState = {};
const store = mockstore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={store}>
        <DeleteEventFab />
    </Provider>
)

describe('Pruebas en DeleteEventFab', () => {


    test('debe de mostrarse correctamente', () => {
        expect(wrapper).toMatchSnapshot()
    });

    test('debe de llamar el eventStartDelete al hacer click', async () => {
        
        await wrapper.find('button').prop('onClick')()

        expect(eventStartDelete).toHaveBeenCalled()

    });
});