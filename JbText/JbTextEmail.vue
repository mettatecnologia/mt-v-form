<template>

        <jb-text
            v-model="vmodel"
            :name="name_cp"
            :label="label_cp"
            :regras="regras_cp"

            :id="id"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :ref="vuetify_ref"

            @input="v => this.$emit('input', v)"
        ></jb-text>

</template>

<script>

export default {
    props:{
        value:String,
        regras:String, label:String, id:String, type:String, placeholder:String, name:String, disabled:Boolean, readonly:Boolean, min:Number, max:Number,
        unique:{type:[Boolean,Array]},
    },
    data() { return {
        vmodel:this.value,
    }},
    computed:{
        regras_cp(){
            let unique = []

            if(this.unique){
                if(this.$typeof(this.unique,'boolean'))
                {
                    unique = ['email-unique']
                }
                else if(this.$typeof(this.unique,'object'))
                {
                    unique = {'email-unique':this.unique}
                }
            }



            let regras = []
            if(this.$typeof(this.regras,'string'))
            {
                regras = [this.regras]
            }
            if(typeof this.regras == 'object')
            {
                regras = this.regras
            }

            return regras.concat(unique).concat(['email'])

        },
        label_cp(){
            return this.label || 'Email'
        },
        name_cp(){
            return this.name || 'email'
        },
        vuetify_ref(){
            return this.ref || 'jb-text'
        }
    },
}
</script>
