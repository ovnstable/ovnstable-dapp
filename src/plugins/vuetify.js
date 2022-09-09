import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import 'vuetify/dist/vuetify.min.css'

import 'font-awesome/css/font-awesome.min.css' // Ensure you are using css-loader

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'fa4',
    },

    theme: {
        options: {
            customProperties: true
        },

        themes: {
            light: {
                background: '#F5F5F5',
                secondary: '#FFFFFF',
                grayTextOne: '#29323E',
                grayTextTwo: '#333333',
                grayTextThree: '#ADB3BD',
                grayTextFour: '#C5C9D1',
            },

            dark: {
                background: '#13151C',
                secondary: '#1D2029',
                grayTextOne: '#FFFFFF',
                grayTextTwo: '#FFFFFF',
                grayTextThree: '#FFFFFF',
                grayTextFour: '#FFFFFF',
            }
        }
    },
});
