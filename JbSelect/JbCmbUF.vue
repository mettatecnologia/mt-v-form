<template>

        <jb-combobox v-model="vmodel" :items="uf" :name="name" :label="label" @input="v => this.$emit('input', v.value)" :regras="regras"  ></jb-combobox>

</template>

<script>

export default {
    props:{
        value:String,
        regras:String,
        name:String,
        label:String,
    },
    data() {return {
        uf:[
            {text:'AC', value:'AC'},
            {text:'AL', value:'AL'},
            {text:'AP', value:'AP'},
            {text:'AM', value:'AM'},
            {text:'BA', value:'BA'},
            {text:'CE', value:'CE'},
            {text:'DF', value:'DF'},
            {text:'ES', value:'ES'},
            {text:'GO', value:'GO'},
            {text:'MA', value:'MA'},
            {text:'MT', value:'MT'},
            {text:'MS', value:'MS'},
            {text:'MG', value:'MG'},
            {text:'PA', value:'PA'},
            {text:'PB', value:'PB'},
            {text:'PR', value:'PR'},
            {text:'PE', value:'PE'},
            {text:'PI', value:'PI'},
            {text:'RJ', value:'RJ'},
            {text:'RN', value:'RN'},
            {text:'RS', value:'RS'},
            {text:'RO', value:'RO'},
            {text:'RR', value:'RR'},
            {text:'SC', value:'SC'},
            {text:'SE', value:'SE'},
            {text:'SP', value:'SP'},
            {text:'TO', value:'TO'},
        ]
    }},
    computed:{
        vmodel(){
            return this.value
        }
    },
}
</script>
