<template>
    <div>
<!--        <div v-if="!isAllDataLoaded"-->
<!--             class="loader-container pt-16">-->
<!--            <div class="row">-->
<!--                <v-row align="center" justify="center">-->
<!--                    <v-progress-circular-->
<!--                            width="2"-->
<!--                            size="24"-->
<!--                            color="#8FA2B7"-->
<!--                            indeterminate-->
<!--                    ></v-progress-circular>-->
<!--                </v-row>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div v-else>-->
        <div>
            <div class="path-view-container">
                <div class="path-view-title container">
                    <div class="row">
                         <div class="col-lg-4 col-md-4 col-sm-12">
                             <div class="routing-plan-container">
                                 <div v-if="isLoadingData || !isAllDataLoaded" class="routing-plan-loader">
                                     <v-progress-circular
                                             width="2"
                                             size="24"
                                             color="#186ADE"
                                             indeterminate
                                     ></v-progress-circular>
                                 </div>
                                 <div :class="isLoadingData || !isAllDataLoaded ? 'routing-plan-loading' : ''"
                                         class="routing-plan">
                                     Routing plan
                                 </div>
                             </div>
                         </div>
                        <div class="col-lg-8 col-md-8 col-sm-12">
                          <div class="routing-info-container">
                              <div class="routing-info-image">
                                  <img src="/assets/icon/swap/path/alert.svg"
                                       class="routing-info-image-config"
                                       alt="!">
                              </div>
                              <div class="routing-info">
                                  The route is preliminary and can be changed before you press swap.
                              </div>
                          </div>
                        </div>
                    </div>
                    <div class="pools-hr mt-3"></div>

                    <div class="row path-tokens">
                        <div class="">
                            <div class="table-info table-tokens">
                                Tokens
                            </div>
                        </div>
                        <div class="">
                            <div class="table-info table-transaction">
                                Transaction type
                            </div>
                        </div>
                    </div>

                </div>

                <div v-if="root"
                     v-for="(branch, index) in Array.from(root.values())" :key="index"
                     class="branch-container">

                    <div class="row">
                        <div class="col-8">
                            <div v-for="(token, tokenIndex) in branch" :key="token.id+index+tokenIndex"
                                 class="token-container">
                                <div class="token-image-container">
                                    <img :src="token.logoUrl"
                                         class="token-image"
                                         :alt="token.symbol">
                                    <div v-if="tokenIndex < branch.length - 1" class="token-arrow-image">
                                        <img src="/assets/icon/swap/path/arrow.svg" alt="->">
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="col-4">
                            <div class="pool-info-container">
                                <div v-if="getUniquePools(branch).length <= 1 &&
                                (getUniquePools(branch).includes('Overnight Wrapper') || getUniquePools(branch).includes('Overnight Exchange'))"
                                     class="swap-name-container">
                                    MINT
                                </div>
                                <div v-else class="swap-name-container">
                                    SWAP
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="isPoolOpenMap[index]" class="pools-container">
                        <div class="pools-hr"></div>
                        <div v-for="(pool, index) in getUniquePools(branch)"
                             :key="pool"
                             class="pools-names-container">
                            <div class="pools-name">
                                {{pool}}
                            </div>
                            <div v-if="index < getUniquePools(branch).length - 1" class="pool-dot">
                                -
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import {defineComponent} from 'vue'
import {tokenLogo} from "@/components/mixins/token-logo";

export default defineComponent({
    name: "PathView",
    mixins: [tokenLogo],
    props: {
        pathObject: {
            type: Object,
            required: false,
            default: null
        },
        inputTokens: {
            type: Array,
            required: true,
            default: []
        },
        outputTokens: {
            type: Array,
            required: true,
            default: []
        },
        isLoadingData: {
            type: Boolean,
            required: true,
            default: true
        }

    },
    data() {
      return {
          root: null,
          isRootLoading: true,
          isImagesLoading: true,
          poolLabelsMap: {}, // key = set() (unique values)

          ovnMarkers: ['USD+', "DAI+", "USDT", "wUSD+"],
          isPoolOpenMap: {}
      }
    },

    mounted() {
        this.init();
    },
    computed: {
        isAllDataLoaded: function () {
            return !this.isImagesLoading && !this.isRootLoading;
        },

    },
    watch: {
        pathObject: function (val, oldVal) {
            if (val) {
                this.init();
            }
        }
    },
    methods: {
        async init() {
            this.isRootLoading = true;
            this.isImagesLoading = true;

            this.pathViz = null;
            this.pathViz = this.pathObject;
            this.root = null;
            await this.initLogos(this.pathViz);
            this.isImagesLoading = false;

            this.root = this.getInitedRoot(this.pathViz, this.inputTokens, this.outputTokens);
            this.isRootLoading = false;

            this.$forceUpdate();
        },
        async initLogos(pathViz) {
            for (let i = 0; i < pathViz.nodes.length; i++) {
                let node = pathViz.nodes[i];
                if (this.ovnMarkers.includes(node.symbol)) {
                    node.logoUrl = await this.loadOvernightTokenImage(node);
                    continue
                }

                node.logoUrl = this.loadTokenImage(node);
            }

            console.log("Logos is loaded: ", this.pathViz)
        },
        getInitedRoot(pathViz, inputTokens, outputTokens) {
            let root = new Map();
            for (let i = 0; i < pathViz.links.length; i++) {
                let link = pathViz.links[i];
                let branch = root.get(link.source);
                if (!branch) {
                    branch = []
                    let id = (Math.random() + 1).toString(36).substring(2);
                    branch.push({
                        id: id,
                        poolLabel: link.label,
                        ...pathViz.nodes[link.source]
                    });

                    id = (Math.random() + 1).toString(36).substring(2);
                    branch.push({
                        id: id,
                        poolLabel: link.label,
                        ...pathViz.nodes[link.target]
                    });
                    console.log("First branch init: ", link.target, branch)
                    root.set(link.source, branch);
                    continue;
                }

                console.log("Founded branch: ", link.source, branch)
                console.log("Add to branch: ", link.source, pathViz.nodes[link.target].symbol, pathViz.nodes[link.target])

                let id = (Math.random() + 1).toString(36).substring(2);
                branch.push({
                    id: id,
                    poolLabel: link.label,
                    ...pathViz.nodes[link.target]
                });

                console.log("new add to branch: ", link.source, branch)
                root.set(link.source, branch);
                console.log("new rename branch to : ", link.target, branch)
                // root.delete(link.source);
                // console.log("Root: ", root);
            }

            // console.log("Inited root: ", root);
            // return root;
            let mergedRoot = this.getMergedBranches(root);
            // return mergedRoot;
            return this.getDuplicateClearedRoot(mergedRoot);
            // return this.getFilteredRoot(mergedRoot, inputTokens, outputTokens);
        },

        getDuplicateClearedRoot(root) {
            if (!root) {
                return root;
            }

            let existsPathMap = new Map(); // write full path by queue of symbol

            console.log("For clear duplicate data: ", root);
            let newRoot = new Map();
            let branches = Array.from(root.values());
            let keys = Array.from(root.keys());
            for (let i = 0; i < branches.length; i++) {
                let branch = branches[i];
                let key = keys[i];

                let branchWithoutDuplicate = [];
                let setBranchWithoutDuplicate = new Set();

                let pathName = "";
                branch.forEach(item => {
                    const fieldValue = item.symbol; // Replace 'name' with the field you want to filter by

                    if (!setBranchWithoutDuplicate.has(fieldValue)) {
                        setBranchWithoutDuplicate.add(fieldValue);
                        branchWithoutDuplicate.push(item);
                        pathName = pathName + "_" + fieldValue;
                    }
                });

                // remove single
                if (!branchWithoutDuplicate || branchWithoutDuplicate.length <= 1) {
                    continue;
                }


                // duplicate path
                if (existsPathMap.get(pathName)) {
                    continue;
                }

                existsPathMap.set(pathName, true);
                newRoot.set(key, branchWithoutDuplicate);
            }

            return newRoot;
        },
        getFilteredRoot(root, inputTokens, outputTokens) {
            if (!root) {
                return root;
            }

            console.log("Filtered data: ", root, inputTokens, outputTokens)
            let newRoot = new Map();
            let branches = Array.from(root.values());
            for (let i = 0; i < inputTokens.length; i++) {
                let token = inputTokens[i].selectedToken;
                let branchInfo = this.findBranchWithFirstToken(root, branches, token);
                if (branchInfo && branchInfo.branch.length < 6) {
                    newRoot.set(branchInfo.key, branchInfo.branch);
                }
            }

             for (let i = 0; i < outputTokens.length; i++) {
                let token = outputTokens[i].selectedToken;
                let branchInfo = this.findBranchWithLastToken(root, branches, token);
                if (branchInfo && branchInfo.branch.length < 6) {
                    newRoot.set(branchInfo.key, branchInfo.branch);
                }
            }

            return newRoot;
        },
        getMergedBranches(root) {
            if (!root) {
                return root;
            }

            let keysToDeleteList = []
            let processConnect = true;
            for (let i = 0; i < 5; i++) {
                let branches = Array.from(root.values());
                let anyConnect = false;
                for (let i = 0; i < branches.length; i++) {
                    let tokens = branches[i];
                    let lastToken = tokens[tokens.length - 1];
                    let branchInfo = this.findBranchWithFirstToken(root, branches, lastToken);
                    if (branchInfo && branchInfo.key) {
                        console.log("Key to delete", branchInfo.key)
                        keysToDeleteList.push(branchInfo.key);
                        anyConnect = true;
                    }

                    let additionalTokens = branchInfo ? ([...branchInfo.branch]) : [];
                    if (additionalTokens.length) {
                        additionalTokens = additionalTokens.slice(1);
                    }

                    this.isPoolOpenMap[i] = true;

                    tokens.push(...additionalTokens);
                }


                if (!anyConnect) {
                    // stop
                    processConnect = false;
                    break;
                }
            }
            // while (processConnect)

            // clear map
            for (let i = 0; i < keysToDeleteList.length; i++) {
                let key = keysToDeleteList[i];
                if (root.get(key)) {
                    root.delete(key);
                }
            }

            console.log("Merged root", root);
            return root;
        },
        getKeyByValue(map, value) {
            for (let [key, val] of map) {
                if (val === value) {
                    return key;
                }
            }
            return null; // If the value is not found in the Map
        },
        findBranchWithFirstToken(root, branches, searchToken) {
            for (let i = 0; i < branches.length; i++) {
                let tokens = branches[i];
                let token = tokens[0];
                if (token.symbol === searchToken.symbol) {
                    let key = this.getKeyByValue(root, tokens);
                    return {
                        key: key,
                        branch: tokens
                    };
                }
            }

            console.log("Branch not found with first token: ", searchToken);
            return null;
        },
        findBranchWithLastToken(root, branches, searchToken) {
            for (let i = 0; i < branches.length; i++) {
                let tokens = branches[i];
                let token = tokens[tokens.length - 1];
                if (token.symbol === searchToken.symbol) {
                    let key = this.getKeyByValue(root, tokens);
                    return {
                        key: key,
                        branch: tokens
                    };
                }
            }

            console.log("Branch not found with first token: ", searchToken);
            return null;
        },
        getUniquePools(branch) {
            // selectedKey is index
            console.log("getUniqueStrings: ", branch, this.root, Array.from(this.root.keys()));
            // Set to store unique strings
            const uniqueSet = new Set();
            //
            // // Iterate over the list of objects
            // let keys = Array.from(this.root.keys());
            for (let i = 0; i < branch.length; i++) {
            //     if (i !== selectedKey) {
            //         continue;
            //     }
                let token = branch[i];
            //     let key = keys[i];
            //     let obj = this.root[key];
            //     console.log("Key object root: ", key, keys, obj, this.root)
            //
            //     // Access the field containing the string
                const stringValue = token.poolLabel
            //
            //     // Add the string to the set
                uniqueSet.add(stringValue);
            }
            //
            // // Convert the set back to an array
            return Array.from(uniqueSet);
        },
    }
})

</script>

<style scoped>
/*Mobile*/
@media only screen and (max-width: 960px) {
    .path-tokens {
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .path-tokens {
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .path-tokens {
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .path-tokens {
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }
}


.div {
    font-family: 'Roboto',serif;
}

.branch-container {
    padding: 12px 16px;

    min-height: 52px;

    background: var(--swap-main-banner-background);
    border-radius: 8px;
    margin-bottom: 8px;
}

.token-container {
    display: inline-block;
    padding-right: 32px;
    padding-top: 5px;
}

.token-image {
    height: 24px;
}

.token-image-container {
    display: inline-block;
    position: relative;
}
.token-arrow-image {
    position: absolute;
    display: inline-block;
    padding-left: 6px;
    padding-right: 4px;
}

.pools-hr {
    border: 1px solid #DEE1E5;
    margin-bottom: 5px;
}

.pool-dot {
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #707A8B;

    padding-left: 5px;
    padding-right: 5px;
}

.pools-name {
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #707A8B;
}

.pools-names-container {
    display: inline;
}

.pools-container {
    display: inline;
    min-height: 52px;
}

.arrow-container {
    position: absolute;
    display: inline-block;
    right: 5px;
    top: 4px;

}

.swap-name-container {
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
    padding-right: 30px;
    color: var(--main-gray-text);
}

.pool-info-container {
    position: relative;
    text-align: end;
}

.table-info {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #ADB3BD;
}

.table-tokens {

}

.table-transaction {
    text-align: end;
}

.routing-plan {
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 36px;
    color: #29323E;
    display: inline-block;

}

.routing-plan-loading {
    padding-left: 30px;
}

.routing-info {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #707A8B;

    display: inline-block;
    text-align: end;
}

.routing-info-container {
    text-align: end;
}


.routing-info-image {
    position: absolute;
    display: inline-block;
}

.routing-info-image-config {
    position: absolute;
    right: 2px;
    top: 2px;
}

.routing-plan-loader {
    display: inline-block;
    padding-bottom: 5px;
    position: absolute;
    top: 3px;

}

.routing-plan-container {
    position: absolute;
}


/* mobile */
@media only screen and (max-width: 960px) {
    .routing-info-container {
        padding-top: 20px;
    }

    .routing-plan {
        font-size: 18px;
    }

    .routing-info {
        text-align: center;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
}
</style>
