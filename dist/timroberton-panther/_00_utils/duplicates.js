export function getUnique(arr) {
    return arr.filter((v, i, a) => a.indexOf(v) === i);
}
export function getDuplicates(arr) {
    return arr
        .filter((v, i, a) => a.indexOf(v) !== i)
        .filter((v, i, a) => a.indexOf(v) === i);
}
export function isUnique(arr) {
    return !arr.some((v, i, a) => a.indexOf(v) !== i);
}
///////////////////////////////////////////////////////////////////////
//  _______                    ______                                //
// /       \                  /      \                               //
// $$$$$$$  | __    __       /$$$$$$  |__    __  _______    _______  //
// $$ |__$$ |/  |  /  |      $$ |_ $$//  |  /  |/       \  /       | //
// $$    $$< $$ |  $$ |      $$   |   $$ |  $$ |$$$$$$$  |/$$$$$$$/  //
// $$$$$$$  |$$ |  $$ |      $$$$/    $$ |  $$ |$$ |  $$ |$$ |       //
// $$ |__$$ |$$ \__$$ |      $$ |     $$ \__$$ |$$ |  $$ |$$ \_____  //
// $$    $$/ $$    $$ |      $$ |     $$    $$/ $$ |  $$ |$$       | //
// $$$$$$$/   $$$$$$$ |      $$/       $$$$$$/  $$/   $$/  $$$$$$$/  //
//           /  \__$$ |                                              //
//           $$    $$/                                               //
//            $$$$$$/                                                //
//                                                                   //
///////////////////////////////////////////////////////////////////////
export function getUniqueByFunc(arr, byFunc) {
    return arr.filter((v1, i, a) => a.findIndex((v2) => byFunc(v2) === byFunc(v1)) === i);
}
export function isUniqueByFunc(arr, byFunc) {
    return !arr.some((v1, i, a) => a.findIndex((v2) => byFunc(v2) === byFunc(v1)) !== i);
}
