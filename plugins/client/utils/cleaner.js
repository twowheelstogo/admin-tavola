export default function cleaner(input, opts = {}) {
  if (typeof input === "object") {
    if (Array.isArray(input)) {
      input.forEach((v, index) => {
        if (typeof v === "object") input[index] = cleaner(v, { ...opts, path: `${opts.path || ""}${index}.` });
        if (opts.paths) {
          const gPath = (opts.path || index.toString()).replace(/\.([0-9]+)(\.)?/, "$");
          if (opts.paths[gPath]) opts.paths[gPath]({ index, v, input, opts });
        }
      });
    } else {
      if (input.__typename) delete input.__typename;
      for (const [k, v] of Object.entries(input)) {
        if (v === null && opts.nullable !== false) delete input[k];
        else if (typeof v === "number") {
          if (opts.numToStr) {
            input[k] = v.toString();
          }
        } else if (typeof v === "string") {
          if (opts.unEmpty && v.trim() === "") {
            delete input[k];
          } else if (opts.strToNum) {
            try {
              const int = parseInt(v.trim());
              if (int.toString().trim() === v.trim()) input[k] = int;
            } catch (error) {
              try {
                const float = parseFloat(v.trim());
                if (float.toString().trim() === v.trim()) input[k] = float;
              } catch (error) {}
            }
          }
        } else if (typeof v === "object") input[k] = cleaner(v, { ...opts, path: `${opts.path || ""}${k}.` });
        if (opts.paths) {
          const gPath = (opts.path || k).replace(/\.([0-9]+)(\.)?/, "$");
          if (opts.paths[gPath]) opts.paths[gPath]({ k, v, input, opts });
        }
      }
    }
  }
  return input;
}
