// ##############################
// // // Student Login styles
// #############################

const StudentLoginStyles = {
    // '@font-face': {
    //     fontFamily: 'Bungee Shade',
    //     src: "url(../../assets/fonts/BungeeShade-Regular.ttf)",
    // },
    '@keyframes move': {
        '0%': {
            backgroundPosition: '0 0',
        },

        '50%': {
            backgroundPosition: '100% 0',
        },

        '100%': {
            backgroundPosition: '0 0'
        }
    },
    '@keyframes arrive': {
        '0%': {
            opacity: 0,
            transform: 'translate3d(0, 50px, 0)',
        },

        '100%': {
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
        }
    },
    '@keyframes NO': {
        'from, to': {
            webkitTransform: 'translate3d(0, 0, 0)',
            transform: 'translate3d(0, 0, 0)',
        },

        '10%, 30%, 50%, 70%, 90%': {
            webkitTransform: 'translate3d(-10px, 0, 0)',
            transform: 'translate3d(-10px, 0, 0)',
        },

        '20%, 40%, 60%, 80%': {
            webkitTransform: 'translate3d(10px, 0, 0)',
            transform: 'translate3d(10px, 0, 0)',
        },
    },
    user: {
        // maxWidth: '400px',
        margin: '0 px auto',
    },
    user__header: {
        textAlign: 'center',
        opacity: 0,
        transform: 'translate3d(0, 500px, 0)',
        animation: 'arrive 500ms ease-in-out 0.7s forwards',
    },
    body: {
        fontFamily: "Roboto",
        // fontSize: '14px',
        backgroundSize: '200% 100% !important',
        animation: 'move 5s ease infinite',
        transform: 'translate3d(0, 0, 0)',
        background: 'white',
        height: '100%',
    },
    user__title: {
        fontSize: '5rem',
        margin: '0px',
        color: '#58b48b',
        fontWeight: 'bold',
        fontFamily: 'Bungee Shade',
    },
    form: {
        margin: "0px auto",
        marginLeft: "25vw",
        marginTop: "19vh",
        padding: " 4vw",
        border: " 2px solid #2ab48b",
        position: "relative",
        overflow: 'hidden',
        opacity: '0',
        transform: 'translate3d(0, 500px, 0)',
        animation: 'arrive 500ms ease-in-out 0.9s forwards',
    },
    'form--no': {
        animation: 'NO 1s ease-in-out',
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
    },
    form__input: {
        display: 'block',
        width: '40vw',
        padding: '15px',
        fontFamily: "Roboto",
        webkitAppearance: 'none',
        border: 0,
        outline: "1px solid #2ab48b",
        transition: '0.3s',

        '& focus': {
            background: 'darken(#fff, 3%)',
        }
    },
    btn: {
        display: 'block',
        width: '100%',
        padding: '20px',
        fontFamily: "Roboto",
        webkitAppearance: 'none',
        border: 0,
        color: 'white',
        background: '#2ab48b',
        transition: '0.3s',

        '& hover': {
            background: 'darken($color-primary, 5%)',
        }
    },
    floatLeft: {
        width: '40%',
    },
    image: {
        width: '10vw',
        marginLeft: "16vw"
    }

};

export default StudentLoginStyles;

