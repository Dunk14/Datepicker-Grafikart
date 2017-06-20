<style lang="scss" xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
    $header-color: #7986CB;
    $header-height: 100px;
    $day-size: 41px;

    .datepicker {
        position: absolute;
        top: 100%;
        width: 315px;
        z-index: 5;
        box-shadow: 0px 2px 4px rgb(120,120,120);
    }

    .datepicker__header {
        background-color: $header-color;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        box-shadow: 0px 6px 8px rgb(180,180,180);
        color: white;
        padding: 20px;
        height: $header-height;
    }

    .datepicker__year {
        opacity: 0.7;
        margin-bottom: 10px;
        line-height: 16px;
    }

    .datepicker__date {
        font-size: 32px;
        line-height: 32px;
    }

    .datepicker__week {
        font-size: 12px;
        line-height: 12px;
        color: rgba(0,0,0,0.8);
        padding: 0 14px;
    }

    .datepicker_weekday {
        background-color: $header-color;
        box-shadow: 0px 6px 8px rgb(180,180,180);
        color: rgb(255,255,255);
        float: left;
        padding: 10px;
        width: $day-size;
        text-align: center;
    }

    .datepicker_weekday:first-child {
        border-bottom-left-radius: 10px;
    }

    .datepicker_weekday:last-child {
        border-bottom-right-radius: 10px;
    }

    .datepicker_days {
        position: relative;
        margin: 0 14px;
    }

    .datepicker__day {
        position: relative;
        width: $day-size;
        height: $day-size;
        float: left;
        text-align: center;
        line-height: $day-size;
        cursor: pointer;
    }

    .datepicker__day__effect {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 36px;
        height: 36px;
        border-radius:50px;
        background-color: $header-color;
        box-shadow:inset 0px 0px 12px rgba(0,0,0,1);
        transition: all 450ms cubic-bezier(0.2, 1, 0.76, 1);
        transform: scale(0);
        opacity: 0;
    }

    .datepicker__day__text {
        position: relative;
    }

    .datepicker__day:hover {
        color: #FFF;

        .datepicker__day__effect {
            transform: scale(1);
            opacity: 0.6;
        }
    }

    .datepicker__day.selected {
        color: #FFF;

        .datepicker__day__effect {
            transform: scale(1);
            opacity: 1;
        }
    }

    .datepicker__controls {
        position: relative;
        line-height: 56px;
        text-align: center;

        button {
            color: $header-color;
            border: none;
            background-color: transparent;
            user-select: none;
            outline: none;
            cursor: pointer;
        }

        button:hover {
            opacity: 0.7;
        }

        button:active {
            text-shadow: 0px 0px 2px #42b983;
        }
    }
    
    .datepicker__prev {
        float: left;
        font-size: 26px;
        margin-top: 12px;
        margin-left: 20px;
    }

    .datepicker__next {
        float: right;
        font-size: 26px;
        margin-top: 12px;
        margin-right: 20px;
    }

    .datepicker__month {
        color: #000;
        text-transform: capitalize;
        position: relative;
        top: 0;
        right:0;
        left:0;
        bottom:0;
    }

    @import 'animations.scss';
</style>

<template>
    <transition name="datepicker-slide">
        <div class="datepicker" v-if="visible" @click.stop>
            <div class="datepicker__header">
                <div class="datepicker__year">
                    {{ year }}
                </div>
                <div class="datepicker__date">
                    {{ date_formatted }}
                </div>
            </div>
            <div class="datepicker__week">
                <div v-for="day in days" track-by="$index" class="datepicker_weekday">
                    {{ day }}
                </div>
            </div>
            <div class="datepicker__controls">
                <div class="datepicker__controls__label">
                    <div class="datepicker__month">
                        {{ month.getFormatted() }}
                        <button class="datepicker__prev" @click="prevMonth()"><i class="fa fa-arrow-circle-o-left"></i></button>
                        <button class="datepicker__next" @click="nextMonth()"><i class="fa fa-arrow-circle-o-right"></i></button>
                    </div>
                </div>
            </div>
            <div class="datepicker_days">
                <div class="datepicker__day" v-bind:style="{width: (month.getWeekStart() * 41) + 'px'}"></div>
                <transition name="month-slide">
                    <div v-for="month in [month]">
                        <div class="datepicker__day" @click="selectDate(day)" v-for="day in month.getDays()" :class="{selected: isSelected(day)}">
                            <span class="datepicker__day__effect"></span>
                            <span class="datepicker__day__text">{{ day.format('D') }}</span>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </transition>

</template>

<script>
import Moment from 'moment'
import Month from '../../modules/Month'
import Vue from 'Vue'
Vue.prototype.bus = new Vue()

export default {
    props: {
        date: {type: Moment, required: true},
        visible: {type: Boolean, default: false}
    },
    data () {
      return {
          days: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
          month: new Month(this.date.month(), this.date.year())
      }
    },

    methods: {
      isSelected (day) {
          return this.date.unix() === day.unix()
      },
      selectDate (day) {
          this.bus.$emit('newDate', day)
      },
      prevMonth () {
          let month = this.month.month - 1
          let year = this.month.year
          if (month < 0) {
              month = 11
              year--
          }
          setTimeout(() => this.month = new Month(month, year), 0)
      },
      nextMonth () {
          let month = this.month.month + 1
          let year = this.month.year
          if (month > 11) {
              month = 0
              year++
          }
          setTimeout(() => this.month = new Month(month, year), 0)
      }
    },
    computed: {
        year () {
            return this.date.format('YYYY');
        },
        date_formatted () {
            return this.date.format('dddd DD MMM');
        }
    }
}
</script>