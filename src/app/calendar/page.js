"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatDate } from "@fullcalendar/core";
import "./calendarHeader.css";
export default function CalenderPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [isPopOverOpen, setPopOver] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectionInfo, setSelectionInfo] = useState(null);
  const [loading, setLoading] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userKey = `events_${user.email}`;
        const storedEvents = JSON.parse(localStorage.getItem(userKey)) || [];
        setEvents(storedEvents);
      } else {
        setEvents([]); // clear if logged out
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    if (events.length === 0) return;
    const userKey = `events_${user.email}`;
    localStorage.setItem(userKey, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (eventTitle && selectionInfo) {
      setEvents([
        ...events,
        {
          title: eventTitle,
          start: selectionInfo.start,
          end: selectionInfo.end,
          date: selectedDate,
          allDay: selectionInfo.allDay,
        },
      ]);
      setEventTitle("");
      setPopOver(false);
    }
  };

  const handleSelect = (info) => {
    setSelectionInfo(info);
    setPopOver(true);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // stack on small, row on large
        width: "100%",
        p: { xs: 1, sm: 2 },
        gap: { xs: 2, md: 3 },
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", md: "24rem" },
          gap: 3,
          pr: { md: 2 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Italiana",
              fontWeight: { xs: 400, xl: 800 },
              mb: 1,
            }}
          >
            Calendar Events
          </Typography>
          <Button
            variant="contained"
            size="small"
            color="inherit"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

        {events.length <= 0 && (
          <Typography
            variant="h6"
            sx={{
              p: 1,
              pb: 0,
              color: "GrayText",
              fontSize: 17,
              fontFamily: "Italiana",
            }}
          >
            No Events Present
          </Typography>
        )}

        {events.length > 0 &&
          events.map((event, ind) => (
            <Paper
              key={ind}
              sx={{
                mb: 1,
                p: { xs: 1, sm: 1.5 },
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  p: 1,
                  pb: 0,
                  color: "#0d47a1",
                  fontSize: { xs: 16, sm: 18 },
                }}
              >
                {event.title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  p: 1,
                  pt: 0,
                  fontSize: { xs: 14, sm: 16 },
                }}
              >
                {formatDate(event.start, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Typography>
            </Paper>
          ))}
      </Box>

      {/* Calendar */}
      <Box
        sx={{
          width: { xs: "100%", md: "80%" },
          position: "relative",
          minHeight: "80vh",
        }}
      >
        <FullCalendar
          height={"95vh"}
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventContent={renderEventContent}
          headerToolbar={{
            left: "prev,next,today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          selectable={true}
          selectMirror={true}
          select={handleSelect}
        />

        <Popover
          anchorOrigin={{ vertical: "center", horizontal: "center" }}
          transformOrigin={{ vertical: "center", horizontal: "center" }}
          open={isPopOverOpen}
        >
          <Box sx={{ p: 3, width: { xs: "90vw", sm: 400 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.3,
              }}
            >
              <Typography>Add New Event Details</Typography>
              <CloseIcon
                onClick={() => setPopOver(!isPopOverOpen)}
                sx={{ cursor: "pointer" }}
              />
            </Box>
            <form onSubmit={handleAddEvent}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1,
                }}
              >
                <TextField
                  placeholder="Event title"
                  onChange={(e) => setEventTitle(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  sx={{ mt: { xs: 1, sm: 0 } }}
                  onClick={handleAddEvent}
                >
                  Add
                </Button>
              </Box>
            </form>
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>&nbsp;
      <i style={{ wordWrap: "break-word" }}>{eventInfo.event.title}</i>
    </>
  );
}
