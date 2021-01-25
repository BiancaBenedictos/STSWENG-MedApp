exports.setTimeout = function() {
    return global.setTimeout.apply(global, 2000);
};