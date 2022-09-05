export default {

    screenSize(){
        return window.innerWidth;
    },

    screenWidthIn(widthMin, widthMax){
        if (widthMin && widthMax) {
            return (window.innerWidth > widthMin) && (window.innerWidth <= widthMax);
        } else {
            if (widthMin) {
                return window.innerWidth > widthMin;
            }

            if (widthMax) {
                return window.innerWidth <= widthMax
            }

            return true;
        }
    },

    isHuge(){
        return window.innerWidth > 1920;
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
