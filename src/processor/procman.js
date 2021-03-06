const assert = require('assert');//.strict;

function es6req(objname)
{
    let o = require(objname);

    assert(undefined === o.default);
    //if(null == o.default)
    return o;

    //return o.default;
}


module.exports =  class ProcMan  {
    
    constructor(opt) {
        //super();


        let defop = {

            processor_use : '../flows/processor.js'
            , status_man_use : './statmanfs.js'
        };
        
        if(null != opt)
            this.options = Object.assign(defop, opt);
        else
            this.options = defop;

        let processor  = this.options.processor_use;
        //if( typeof processor === 'string')
        assert(typeof processor === 'string');
        processor = es6req(processor);

        this.statman   = es6req(this.options.status_man_use);

        let statopt    = Object.assign(this.options, {  });

        //console.log(statopt, this.processor, this.statman);

        this.state     = new this.statman(processor, statopt);

    }

    async reserve_name(owner, name)
    {
        
        return this.state.reserve_name(owner, name);
    }

    async stop()
    {
        return this.state.stop();
    }

    async queue_job(owner, name, file, opt)
    {
        try{

            await this.state.queue_job(owner, name, file, opt);

        }catch(err){

            await this.state.record_error(owner, name, err);

        }
    }

    async list(owner, opt)
    {
        
        return this.state.list(owner, opt);
    }

    async status(owner, id)
    {
        
        return this.state.status(owner, id);
        
    }

    async queue_status(owner, id)
    {
        
        return this.state.queue_status(owner, id);
        
    }

    async redo(owner, id, operation_id)
    {
        return this.state.redo(owner, id , operation_id);
    }

    async queue_operation_list(owner, id)
    {
        return this.state.queue_operation_list(owner, id);
    }

    record_error(owner, id, err, info)
    { 
        this.state.record_error(owner, id, err, info).then(()=>{}).catch(
            (err)=>{console.error('record_error error', err.message, err.stack);}
        );
    }
};
