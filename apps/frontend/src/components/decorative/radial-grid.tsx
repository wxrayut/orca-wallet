export function RadialGrid() {
    return (
        <div className="absolute -top-2 left-0 -z-999 h-150 w-full">
            <div className="absolute inset-0 w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent),linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] bg-size-[40px_40px] [mask-composite:intersect] [-webkit-mask-composite:source-in] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent),linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"></div>
        </div>
    );
}
