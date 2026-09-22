import { Paper, Stack, Button, Box, Typography, Divider } from '@mui/material';
import React from 'react';
import Container from './Container';
import Logo from './Logo';
import menuConfigs from "../../configs/menu.configs";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Container>
      <Paper square={true} sx={{ backgroundImage: "unset", padding: "2rem" }}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction={{ xs: "column", md: "row " }}
          sx={{ height: "max-content" }}
        >
          <Logo />
          <Box>
            {menuConfigs.main.map((item, index) => (
              <Button
                key={index}
                sx={{ color: "inherit" }}
                component={Link}
                to={item.path}
              >
                {item.display}
              </Button>
            ))}
          </Box>
        </Stack>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Powered by <span style={{ color: "#16A366", fontWeight: "bold" }}>ElitJohns Digital Agency</span>
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 1 }}>
            © 2024 Mamovie. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Footer;