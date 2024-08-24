export type OptionsObjOrPrevFunc<Opts, Prev> = Opts | ((prev: Prev) => Opts);
export declare function getOptionsFromObjOrPrevFunc<Opts, Prev>(objOrPrevFunc: OptionsObjOrPrevFunc<Opts, Prev>, prev: Prev): Opts;
