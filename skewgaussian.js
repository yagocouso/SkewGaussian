'use strict'

class Core{

    #_location;
    #_scale;
    constructor(location, scale){
        this.#_location = location;
        this.#_scale = scale;
    }

    /** @todo private */ 
    normalize(x) {
        return (x - this.#_location) / this.#_scale;
    }

    erfc(x) {
        return 1 - math.erf(x);
    }

    erfi(x) {
        return -math.erf(x);
    }

    znorm1(x) {
        return 0.5 * math.erf(x / Math.SQRT2);
    }

    znorm2(x) {
        return 0.5 * (1 - math.erf(x / Math.SQRT2));
    }

    /** @todo private */
    _ppf(x){
        const exp = - Math.pow(x - this.#_location, 2) / 2 / this.#_scale / this.#_scale;
        const a = 2 * Math.exp(exp) / this.#_scale / Math.sqrt(2 * Math.PI);
        return 0.5 * a;
    }

    /** @todo private */
    _cdf(){
        return 0.5 + this.znorm1(this.normalize(x));
    }

    /** @todo private */
    _random() {
        let u1 = 0, u2 = 0;
        while (u1 === 0) u1 = Math.random(); //Convert [0,1) to (0,1)
        while (u2 === 0) u2 = Math.random(); //Convert [0,1) to (0,1)
        const R = Math.sqrt(-2.0 * Math.log(u1));
        const Θ = 2.0 * Math.PI * u2;
        return [R * Math.cos(Θ), R * Math.sin(Θ)];
    }

}


class Gaussian extends Core{
    #mean;
    #variance;
    constructor(mean, variance){
        this.#mean = mean;
        this.#variance = variance;
    }

    get mean(){
        return this.#mean;
    }
    get variance(){
        return this.#variance;
    }
    get std(){
        return Math.sqrt(this.#std, 2);
    }

    cdf(x){
        return this._cdf(x);
    }

    ppf(x){
        return this._ppf(x);
    }

    pdf(x){
        return this._ppf(x);
    }

    ccdf(x){
        return 1 - this._cdf(x);
    }

    random(elementsNumber){
        // I should search, how do i create a generador in javascript
    }

}

class skewGaussian extends Core {
    #location;
    #scale;
    #skew;
    constructor(location, scale, skew){
        super();
        this.#location = location;
        this.#scale = scale;
        this.#skew = skew;
    }
    get mean(){return this.#mean;}
    get variance() { return Math.pow(this.scale, 2) * (1 - 2 * Math.pow(this.delta, 2) / Math.PI); }
    get std(){ return Math.pow(this.variance, 2);}
    get location() {return this.#location;}
    get scale() {return this.#scale;}
    get apha(){return this.#skew}
    get delta() { return this.skew / Math.sqrt(1 + Math.pow(this.skew, 2)); }
    get copy(){return skewMeanGaussian(this.mean, this.variance)}
    pdf(){

    }

    cdf(){

    }

    ccdf(){
        return 1 - this.cdf(x);
    }

    ppf(){

    }
}

class skewMeanGaussian extends Core {
    #mean;
    #variance;
    #skew;
    constructor(mean, variance, skew){
        super();
        this.#mean = mean;
        this.#variance = variance;
        this.#skew = skew;
    }

    get mean(){return this.#mean;}
    get variance() { return this.#variance }
    get std() { return this.scale; }
    get location() { return this.mean - this.scale * this.delta * Math.sqrt(2 / Math.PI); }
    get scale() {
        return Math.sqrt(this.variance / (1 - (2 * Math.pow(this.delta, 2) / Math.PI)), 2);
    }
    get apha(){return this.#skew}
    get delta() { return this.skew / Math.sqrt(1 + Math.pow(this.skew, 2)); }
    get copy(){return skewMeanGaussian(this.mean, this.variance)}

    pdf(){
        let result = [];
        for (let arg of args) {
            const exp = - Math.pow(x - this.location, 2) / 2 / this.scale / this.scale;
            const a = 2 * Math.exp(exp) / this.scale / Math.sqrt(2 * Math.PI);
            const b = this.znorm1((this.normalize(x) * this.skew) || 0);
            result.push(0.5 * a + b * a);
        }
        return result.length == 1 ? result[0] : result;
    }

    cdf(...args){
        let result = [];
        for (let arg of args){
            if (!arg || arg == Infinity) result.push(!arg ? 0 : 1);
            else result.push()
        }
        return result.length == 1 ? result[0] : result; 
    }

    ccdf(...args){
        let result = [];
        for (let arg of args) result.push(1 - this.cdf(arg));
        return result.length == 1 ? result[0] : result;
    }

    ppf(){
        if (x > 1 || x < 0) throw "Valor fuera de rango";
        let [currentValue, percent, cont] = [this.mean, Infinity, 500];
        while (Math.abs((percent - x) / x) > this.precision && --cont) {
            percent = this.cdf(currentValue);
            currentValue = currentValue * (1 + ((x - percent) / percent));
        }
        return currentValue;

    }

}

module.exports = { 
    Gaussian, 
    skewGaussian, 
    skewMeanGaussian
}