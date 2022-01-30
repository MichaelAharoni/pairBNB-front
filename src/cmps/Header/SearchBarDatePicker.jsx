import * as React from 'react';

import TextField from '@mui/material/TextField';
import StaticDateRangePicker from '@mui/lab/StaticDateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from "@mui/material/styles";

export function SearchBarDatePicker({ searchBarTabs,updateHeaderActiveTab, ChooseDates }) {

    const [value, setValue] = React.useState([null, null]);

    const theme = createTheme({
        palette: {
            primary: {
                main: "#FF385C"
            },
            secondary: {
                main: "#FF385C"
            }
        }
    });

    React.useEffect(() => {
        ChooseDates(value)
    }, [value])


    return (
        <section className='search-bar-date-picker'>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticDateRangePicker
                        displayStaticWrapperAs="desktop"
                        value={value}
                        disableCloseOnSelect={true}
                        onChange={async (newValue) => {
                           await setValue(newValue);
                            updateHeaderActiveTab((searchBarTabs === "check-in") ? "check-out" : "guests");
                        }}
                        renderInput={(startProps, endProps) => (
                            <React.Fragment>
                                <TextField {...startProps} />
                                <Box sx={{ mx: 2 }}> to </Box>
                                <TextField {...endProps} />
                            </React.Fragment>
                        )}
                    />
                </LocalizationProvider>
            </ThemeProvider>
        </section>
    );
}