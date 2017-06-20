<style>
    .datepicker__container {
        position: relative;
    }
</style>

<template>
    <div class="datepicker__container">
        <div>
            <input type="text" v-model.value="date_formatted" @click="showDatepicker()"><br>
            <input type="text" v-model.value="date_raw" hidden>
            <datepicker-agenda :date="date" :visible="isVisible"></datepicker-agenda>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
Vue.prototype.bus = new Vue()
moment.locale('fr')

import DatepickerAgenda from './datepicker-agenda.vue'

export default {
    components: {
        'datepicker-agenda': DatepickerAgenda
    },
    props: {
        value: { type: String, default: moment() },
        format: { type: String, default: 'DD/MM/YYYY' }
    },
    methods: {
        showDatepicker () {
            this.isVisible = true
            setTimeout(() => document.addEventListener('click', this.hideDatepicker), 0)
        },
        hideDatepicker () {
            this.isVisible = false
            document.removeEventListener('click', this.hideDatepicker)
        }
    },
    created () {
        let _this = this
        this.bus.$on('newDate', function (date) {
            _this.date = moment(date, _this.format)
        })
    },
    data: function () {
        return {
            isVisible: false,
            date: moment(this.value, this.format)
        }
    },
    computed: {
        date_formatted: function () {
            return this.date.format(this.format);
        },
        date_raw: function () {
            return this.date.format('YYYY-MM-DD');
        }
    },
    template: ''
}
</script>