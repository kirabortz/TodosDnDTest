import { ClassNameMap, Grid, Pagination, Paper } from "@mui/material";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {useTheme} from "@mui/material/styles";

export const MyPagination = () => {
    const theme: any = useTheme();
    const styles = {
        ul: {
            "& .MuiPaginationItem-root": {
                backgroundColor: theme.palette.mode === "dark" ? "#ffffff" : "#171717",
                color: theme.palette.mode === "dark" ? "#171717" : "#ffffff",

                "&.Mui-selected": {
                    backgroundColor: "#6c00ea",
                },
            },
        },
    };

    return (
        <Stack spacing={2} direction={"column"}>
            <Box sx={styles.ul}>
                <Pagination count={10} shape="rounded" variant="outlined" />
            </Box>
        </Stack>
    );
};

