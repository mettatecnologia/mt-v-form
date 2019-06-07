<template>

        <v-menu
            ref="dtp_menu"
            v-model="menu.exibir"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
        >
            <template v-slot:activator="{ on }">
                <jb-text
                    ref="dtp_input"

                    v-model="vmodel"

                    :label="label"
                    :hint="hint"
                    :persistent-hint="persistentHint"
                    :append-icon="input.appendIcon"
                    :readonly="readonly"
                    clearable

                    :regras="picker_tipo+'|'+regras"
                    :mascara="picker_tipo"

                    v-on="on"

                    @input="textFieldEmit"
                ></jb-text>
            </template>

            <v-card>
                <!-- ===========================
                            Tabs
                     =========================== -->
                <v-toolbar v-if="picker_tipo=='datetime'" color="primary" dark tabs >
                    <template>
                        <v-tabs v-model="tabs.index" color="primary" grow >
                            <v-tab> <v-icon>event</v-icon> </v-tab>
                            <v-tab> <v-icon>access_time</v-icon> </v-tab>

                            <v-tabs-slider color="yellow"></v-tabs-slider>
                        </v-tabs>
                    </template>
                </v-toolbar>

                <!-- ===========================
                            Datepicker (trabalha apenas com datas yyyy-mm-dd)
                     =========================== -->
                <v-tabs-items v-model="tabs.index">
                    <v-tab-item v-if="picker_tipo=='datetime' || picker_tipo=='date'" >
                        <v-date-picker v-model="date_picker" @input="datePickerEmitInput" reactive  ref="datepicker"  ></v-date-picker>
                    </v-tab-item>
                    <v-tab-item v-if="picker_tipo=='datetime' || picker_tipo=='time'" >
                        <v-time-picker v-if="menu.exibir" v-model="time_picker" @input="timePickerEmitInput"  @click:minute="timePickerEmitClick" format="24hr" full-width ></v-time-picker>
                    </v-tab-item>
                </v-tabs-items>


                <!-- ===========================
                            Rodape
                     =========================== -->
                <v-flex xs12 v-if="picker_tipo=='date'" class="py-1 text-xs-center">
                    <v-btn @click="setarDataHoje" color="primary">Hoje</v-btn>
                </v-flex>

                <v-flex xs12 v-if="picker_tipo=='time'" class="py-1 text-xs-center">
                    <v-btn @click="setarHoraAgora" color="primary">Agora</v-btn>
                </v-flex>

                <v-layout v-if="picker_tipo=='datetime'"  column >
                    <v-flex xs12 class="py-2 text-xs-center">
                        <strong>{{ vmodel }}</strong>
                    </v-flex>

                    <v-flex xs12 class="pb-1 text-xs-center">
                        <v-btn @click="setarDataHoraAgora" color="primary">Agora</v-btn>
                    </v-flex>
                </v-layout>

            </v-card>

        </v-menu>

</template>

<script>

import moment from 'moment'

export default {
    props:{
        value:String,
        regras:String, label:String, id:String, type:String, placeholder:String, name:String, disabled:Boolean, readonly:Boolean, min:Number, max:Number,
        tipo:String,

        autofocus:Boolean,
        counter:{type:[Boolean, Number, String]},
        appendIcon:String,
        iconClickAppend:{type:Function, default:v=>(v)},
        hint:String,
        persistentHint:Boolean,

        historica:Boolean
    },

    data () {return{
        tabs: {
            index: null
        },
        menu:{
            exibir: false
        },
        input:{
            appendIcon: this.appendIcon
        },
        date_picker: null,
        time_picker: null,
        active_date_picker: 'DATE',
        picker_tipo_aux: this.tipo
    }},

    computed: {
        picker_tipo(){
            
            if( ! this.picker_tipo_aux){
                this.setarTipoAux()
            }
            return this.picker_tipo_aux=='time' || this.picker_tipo_aux=='datetime' ? this.picker_tipo_aux : 'date'
        },
        vmodel () {
            // configurar como os valores devem ser exibidos para usuario
            // o value deve ser sempre no formato bruto (como no banco de dados)

            if(this.value || this.date_picker || this.time_picker){
                if(this.picker_tipo=='time'){
                    return this.time_picker
                }
                else {
                    return [this.date_picker.split('-').reverse().join('/'), this.time_picker].join(' ').trim()
                }
            }
        },
    },
    created(){
        this.setarIconeInput()
        this.separarDateTime()
    },
    watch: {
        'menu.exibir' (v) {
            if(this.picker_tipo!='time' && this.historica){
                v && setTimeout(() => (this.$refs.datepicker.activePicker = 'YEAR'))
                this.active_date_picker = 'YEAR'
            }
        },
    },
    methods: {
        textFieldEmit(v){
            if( ! v){ return '' }

            v = v.split(' ')
            v[0] = v[0].split('/').reverse().join('-')
            v = v.join(' ')

            if(moment(v).isValid()){
                this.$emit('input', v)
            }

        },
        datePickerEmitInput(v){
            this.$emit('input', v)
            let old_active_date_picker = this.active_date_picker
            let new_active_date_picker = this.$refs.datepicker.activePicker

            let date_picker_date = old_active_date_picker == 'DATE' && new_active_date_picker == 'DATE'

            if(date_picker_date){
                if(this.picker_tipo=='datetime' ){
                    this.tabs.index = 1
                }
                else {
                    this.menu.exibir = false
                }
            }

            this.active_date_picker = new_active_date_picker
        },
        timePickerEmitInput(v){
            this.$emit('input', this.vmodel)
        },
        timePickerEmitClick(v){
            if(this.picker_tipo=='datetime'){
                this.tabs.index = 0
            }
            this.menu.exibir = false
        },
        setarTipoAux(){
            if( ! this.picker_tipo_aux){
                let tipo = null
                if(this.$buscarRegExp('time').test(this.value)){
                    tipo = 'time'
                }
                else if(this.$buscarRegExp('date_us').test(this.value)){
                    tipo = 'date'
                }
                else if(this.$buscarRegExp('datetime_us').test(this.value)){
                    tipo = 'datetime'
                }

                this.picker_tipo_aux = tipo
            }
        },
        setarIconeInput(){
            let icone = null
            if(this.appendIcon){
                icone = this.appendIcon
            }
            else if(this.picker_tipo=='time'){
                icone = 'access_time'
            }
            else {
                icone = 'event'
            }

            this.input.appendIcon = icone
        },
        separarDateTime(){
            if( ! this.value){
                return 
            }
            
            if(this.picker_tipo == 'time'){
                this.time_picker = this.value
            }
            else {
                [this.date_picker, this.time_picker] = this.value.split(' ')
            }
        },
        setarDataHoje(){
            this.date_picker = moment().format('YYYY-MM-DD')
            this.menu.exibir = false
        },
        setarHoraAgora(){
            this.time_picker = moment().format('HH:mm')
            this.menu.exibir = false
        },
        setarDataHoraAgora(){
            this.date_picker = moment().format('YYYY-MM-DD')
            this.time_picker = moment().format('HH:mm')
            this.tabs.index = 0

            this.menu.exibir = false
        },
    }
}
</script>

