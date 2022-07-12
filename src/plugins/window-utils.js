export default {

    screenSize(){
        return window.innerWidth;
    },

    isFull(){
        return window.innerWidth > 1400;
    },

    isTablet(){
        return (window.innerWidth > 960) && (window.innerWidth <= 1400);
    },

    isMobile(){
        return window.innerWidth <= 960;
    },
}
