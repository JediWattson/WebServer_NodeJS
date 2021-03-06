module.exports = function mysqlconn(t){
    const fs = require('fs')
	//only can work from cloudserver set up to accept ip hence why root is pw
	var book =  require('bookshelf')
	(require('knex')
		({client: 'mysql', 
	        connection:{
				user: 'root',
				database: 'test'
			}
		})
	)
	book.plugin('pagination')
	this.userTable = function(t){
		return book.Model.extend({tableName: t}
			,{
			byHandle: function(handle){
				return this.forge().query({where:{handle: handle}}).fetch();
			},
			byFID: function(fID){
				return this.forge().query({where:{fbid: fID}}).fetch();
			},
			initUser: function(data){
				return this.forge(data).save();
			}
		})}	
	this.blogTable = function(t){
		return book.Model.extend({tableName: t, idAttribute: "row"}
			,{
			byHandle: function(handle){
				return this.forge().query({where:{handle: handle}}).fetch();
			},
			getRows: function(){
				console.log(this.fetchPage())
				return this.fetchPage({usingPageSize: true})
			},
			addBlog: function(blog){
				return this.forge(blog).save()
			}
	})}
	return book
}
