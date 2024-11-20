import { AppBar, Card, CardContent, Toolbar, Typography } from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

function Apropos({ contact }) {
  const authRole = useSelector((state) => state.auth.user.role);
  const authUserId = useSelector((state) => state.auth.user.data.id);
  const { userId } = useParams();
  const {
    firstname,
    lastname,
    phonenumber,
    email,
    role,
    date,
    company,
    siren,
    address,
    postalcode,
    city,
    color,
  } = contact;

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <div className="md:flex max-w-2xl">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
          <Card
            component={motion.div}
            variants={item}
            className="w-full mb-32 rounded-16 shadow"
          >
            <AppBar position="static" elevation={0}>
              <Toolbar className="px-8">
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  className="flex-1 px-12 font-medium"
                >
                  {firstname} {lastname.toUpperCase()}
                </Typography>
              </Toolbar>
            </AppBar>

            <CardContent>
              <div className="mb-16">
                <Typography className="font-semibold mb-4 text-15">
                  N° de Téléphone
                </Typography>
                <Typography>{phonenumber}</Typography>
              </div>

              <div className="mb-16">
                <Typography className="font-semibold mb-4 text-15">
                  Adresse E-mail
                </Typography>
                <Typography>{email}</Typography>
              </div>

              <div className="mb-16">
                <Typography className="font-semibold mb-4 text-15">
                  Couleur associée
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 150,
                    height: 30,
                    backgroundColor: color,
                    color: "#FFFFFF",
                    borderRadius: 30,
                  }}
                >
                  <Typography>12H - RDV</Typography>
                </div>
              </div>

              {(authRole === "admin" || authRole === "uadmin") && (
                <div className="mb-16">
                  <Typography className="font-semibold mb-4 text-15">
                    Rôle
                  </Typography>
                  <Typography>{role}</Typography>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default Apropos;
