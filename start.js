/* it is a bit more
   * readable
   * flexible
   * extensible
   ;) */

function bundle() {
  // even though 'parcel'-guy is all-in-all zero-configuration
  // it's not that easy to make it do the right job:
  new (require('parcel'))('index.html', {watch: false}).bundle()
}

function open() {
  require('opn')('dist/index.html')
}

bundle(); open()