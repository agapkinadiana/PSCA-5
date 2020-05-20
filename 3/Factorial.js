class Factorial {
    constructor(data) {
        this.data = data;
    }

    static factorial(n) {
        return (n != 1) ? n * Factorial.factorial(n - 1) : 1;
    }

    factorialAsync(x, cb) {
        this.data(() => {
            cb(null, Factorial.factorial(x));
        })
    }
}
module.exports = Factorial;