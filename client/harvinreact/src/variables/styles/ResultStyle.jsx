const ResultStyle = {
    container: {
        width: " 80%",
        margin: " 0px auto",
        /* background-color:" aliceblue "*/
    },
    bannerImage: {
        width: " 100vw",
        height: " 60vh",
    },
    center: {
        /* width:" 100%, "*/
        margin: " 0px auto",
        /* display:" inline-block, "*/
    },
    body: {
        backgroundColor: "white",
    },

    gridMain: {
        display: " grid",
        height: " 100px",
        gridTemplateColumns: " repeat(2, 1fr)",
        gridTemplateRows: " 100px",
    },
    button: {
        margin: " 2%",
        backgroundColor: " white",
        width: " 50%",
        height: " 35%",
        fontSize: " 2.3vh",
        border: " 2px solid ",
        borderRadius: " 20px",
        borderColor: " #29b38a",
    },
    button: {
        ":hover": {
            backgroundColor: " #29b38a",
            color: " white",
        }
    },
    mainHeadRow: {
        borderTop: " 2px solid #29b38a",
        borderBottom: " 2px solid #29b38a",
        borderRadius: " 20px",
        borderBottomRightRadius: " 20px",
        width: " 100%",
    },
    tableHead: {
        borderLeft: " 1px solid #29b38a ",
    },
    divButton: {
        /* float:" left, "*/
        /* display:" inline-block "*/
    },

    leftBorder: {
        borderRadius: " 10px 0 0 10px",
        mozBorderRadius: " 10px 0 0 10px",
    },
    rightBorder: {
        borderRadius: " 10px 0 0 10px",
        mozBorderRadius: " 10px 0 0 10px",
    },
    footer: {
        height: " 30vh",
        backgroundColor: " black",
        marginTop: " 5vh",
        paddingTop: " 5vh",
    },

    footerLogoImg: {
        width: " 7vh",
        height: " 7vh",
        margin: " 2vh",
    },
    footerLogo: {
        width: " 33vh",
        margin: " 0px auto",
    },
    footerText: {
        width: " 11vh",
        textAlign: " center",
        float: " left",
        margin: " 0px auto",
    },
    footerTextHolder: {
        width: " 33vh",
        margin: " 0px auto",
    },

    table: {
        tr: {
            "last-child td:first-child ": {
                /* border:"2px solid #29b38a",
                border-bottom-left-radius:" 10px, "*/
            }
        }
    },

    "@media only screen and (max-width:600px) ": {
        button: {
            width: " 100%",
        },

    },

    /* Small devices (portrait tablets and large phones, 600px and up) */
    "@media only screen and (min-width: 600px)": {
        button: {
            width: " 80%",
        },

    },

    /* Medium devices (landscape tablets, 768px and up) */
    "@media only screen and (min-width: 768px)": {
        button: {
            width: " 60%",
        },

    },

    /* Large devices (laptops/desktops, 992px and up) */
    "@media only screen and (min-width:992px)": {
    },
}

module.exports = ResultStyle