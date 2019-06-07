import Model from '@/models/base/Model'

export default class Auth extends Model {

    resource()
    {
        return ``
    }

    buscarCidadesPorEstado(estado){
        let request = this.reconfigurarRequest('GET', `buscarCidadesPorEstado/${estado}`)
        return this.executar(request)
    }

}