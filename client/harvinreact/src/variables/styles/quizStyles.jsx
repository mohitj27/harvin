// ##############################
// // // Dashboard styles
// #############################

const quizStyles = {
    quizNavButton: {
        background: '#e7e7e7',
        color: '#656464',
        margin: '5px',
        border: 'none',
        minWidth: '40px',
        display: 'inline-block',
        position: 'relative',
        borderRadius: '4px',
        textAlign: 'center',
        padding: '12px',
        '&:hover': {
            boxShadow: '0 12px 20px -10px rgba(0, 188, 212, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(0, 188, 212, 0.2)',
          },

      },
    markForLater: {
        float: 'right',
      },
    buttonBadge: {
        backgroundColor: '#fa3e3e',
        borderRadius: '200px',
        color: 'white',
        padding: '1px 3px',
        fontSize: '10px',
        position: 'absolute',
        marginLeft: '-12px',
        height: '6px',

      },
    badge: {

        top: '-24px',
        right: '-18px',
        height: ' 18px',
      },
    qStatus: {
      borderBottom: '3px solid #13b38b',
    },
    selectedQuestion: {
            boxShadow: '0 12px 20px -10px rgba(0, 188, 212, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(0, 188, 212, 0.2)',
          },
  };

export default quizStyles;
