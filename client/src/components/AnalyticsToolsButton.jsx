import { Button, Typography, Box, Icon } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { tokens } from "../theme";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const ComparePortfolio = ({ route, title }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);  // If you're using this

    return (
        <Box
        
        alignItems="center"
       
        justifyContent="center">
            <Button 
                size="medium" 
                startIcon={<CompareArrowsIcon />} 
                component={Link}
                to={route}
                sx={{
                    width: '56px',  // or any size you want the circle to be
                    height: '56px',
                    borderRadius: '50%', // this makes it a circle
                    padding: 2, // remove padding so icon sits centrally
                    backgroundColor: colors.greenAccent[200]
                }}
            >
            </Button>

            <Typography variant="body1" style={{ marginTop: '8px' }}>
                {title}
            </Typography>
        </Box>
    );
}

export default ComparePortfolio;
