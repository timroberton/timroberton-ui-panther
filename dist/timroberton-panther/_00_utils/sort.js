export function getSortedAlphabetical(arr) {
    const newArr = [...arr];
    sortAlphabetical(newArr);
    return newArr;
}
export function sortAlphabetical(arr) {
    arr.sort(sortFuncAlphabetical);
}
export function sortFuncAlphabetical(a, b) {
    const a1 = a.toLowerCase().trim();
    const b1 = b.toLowerCase().trim();
    if (a1 < b1) {
        return -1;
    }
    if (a1 > b1) {
        return 1;
    }
    return 0;
}
export function sortFuncAlphabeticalReverse(b, a) {
    const a1 = a.toLowerCase().trim();
    const b1 = b.toLowerCase().trim();
    if (a1 < b1) {
        return -1;
    }
    if (a1 > b1) {
        return 1;
    }
    return 0;
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
export function getSortedAlphabeticalByFunc(arr, byFunc) {
    const newArr = [...arr];
    sortAlphabeticalByFunc(newArr, byFunc);
    return newArr;
}
export function sortAlphabeticalByFunc(arr, byFunc) {
    arr.sort((a, b) => {
        const a1 = byFunc(a).toLowerCase().trim();
        const b1 = byFunc(b).toLowerCase().trim();
        if (a1 < b1) {
            return -1;
        }
        if (a1 > b1) {
            return 1;
        }
        return 0;
    });
}
