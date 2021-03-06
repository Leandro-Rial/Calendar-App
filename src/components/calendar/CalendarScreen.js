import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Navbar from '../ui/Navbar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import CalendarEvent from './CalendarEvent';
import { useState } from 'react';
import CalendarModal from './CalendarModal';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/events';
import AddNewFab from '../ui/AddNewFab';
import DeleteEventFab from '../ui/DeleteEventFab';
import { useEffect } from 'react';

const localizer = momentLocalizer(moment)

const CalendarScreen = () => {

    const dispatch = useDispatch();
    const { uid } = useSelector(state => state.auth)
    const { events, activeEvent } = useSelector(state => state.calendar)

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month' );

    useEffect(() => {
        dispatch(eventStartLoading())
    }, [dispatch])

    const onDoubleClick = (e) => {
        dispatch(uiOpenModal())
    }

    const onSelectEvent = (e) => {
        dispatch(eventSetActive(e))
    }

    const onViewChange = (e) => {
        setLastView(e)
        localStorage.setItem('lastView', e);
    }

    const onSelectSlot = (e) => {
        dispatch(eventClearActiveEvent())
    }

    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: (uid === event.user._id) ? "#6893dd" : "#465660",
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
        }

        return {
            style
        }
    }

    return (
        <div className="calendar-screen">
            <Navbar />

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelectEvent}
                onView={onViewChange}
                onSelectSlot={onSelectSlot}
                selectable={true}
                view={lastView}
                components={{
                    event: CalendarEvent
                }}
            />

            {
                activeEvent
                &&
                <DeleteEventFab />
            }

            <AddNewFab />

            <CalendarModal />
        </div>
    )
}

export default CalendarScreen
