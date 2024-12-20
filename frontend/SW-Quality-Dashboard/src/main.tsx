import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client';
import App from './App'
import {createTheme, ThemeProvider} from "@mui/material";
import {BrowserRouter} from "react-router-dom";

const theme = createTheme({
    palette: {
        // Define your palette colors here
    },
    // Other theme properties
});

const container = document.getElementById('root');
const root = createRoot(container!)
root.render(
    <ThemeProvider theme={theme}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ThemeProvider>
)
