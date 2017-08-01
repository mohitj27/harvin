var errors = {
    
    noContent: function (message, statusCode) {
        
        Error.captureStackTrace(this, this.constructor);
        
        this.name = this.constructor.name;
        this.message = message || 'There is no requested content available';
        this.statusCode = statusCode || 204;
    },

    notFound:   function (message, statusCode) {
        
          Error.captureStackTrace(this, this.constructor);
        
          this.name = this.constructor.name;
          this.message = message || 'The requested resource couldn\'t be found';
          this.statusCode = statusCode || 404;
    },

    generic:    function (message, statusCode) {
        
          Error.captureStackTrace(this, this.constructor);
        
          this.name = this.constructor.name;
          this.message = message || 'Something went wrong. Pls try again';
          this.statusCode = statusCode || 500;
    }
};

module.exports = errors;