<template>

        <jb-text
            v-model="vmodel"
            :name="name_cp"
            :label="label_cp"
            :regras="regras_cp"

            @input="value => this.$emit('input', value)"
        ></jb-text>

</template>

<script>

export default {
    props:{
        value:String,
        regras:String, label:String, id:String, type:String, placeholder:String, name:String, disabled:Boolean, readonly:Boolean, min:Number, max:Number,
        unique:Array,
    },
    data: function () {
        return {
        }
    },
    computed:{
        vmodel(){
            return this.value
        },
        regras_cp(){
            let unique = ''
            if(this.unique){
                unique = 'email-unique'

                if({}.hasOwnProperty.call(this.unique,'ignore_id') && this.unique.ignore_id>0){
                    unique += ':ignore_id='+ this.unique.ignore_id
                }
            }

            return `email|${this.regras}|${unique}`
        },
        label_cp(){
            return this.label || 'Email'
        },
        name_cp(){
            return this.name || 'email'
        },
    },
}
</script>
