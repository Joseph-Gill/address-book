// Mock Database for Address Book

const database = {
  addresses: [
    {
      id: 0,
      name: "Joseph Gill",
      address: "Förrlibuckstrasse 189, 8005 Zurich",
      phoneNumber: "+41 78 731 22 76"
    },
    {
      id: 1,
      name: "Kimberly Hiller",
      address: "Badenerstrasse 678, 8048 Zurich",
      phoneNumber: "+41 78 732 7654"
    },
    {
      id: 2,
      name: "Linda Garbis",
      address: "Josefstrasse 225, 8005 Zurich",
      phoneNumber: "+41 78 731 99 45"
    },
    {
      id: 3,
      name: "Taso Garbis",
      address: "Letzigraben 176, 8047 Zurich",
      phoneNumber: "+41 78 732 88 13"
    },
    {
      id: 4,
      name: "Habib Kadiri",
      address: "Bellerivestrasse 138, 8008 Zurich",
      phoneNumber: "+41 78 731 17 93"
    },
  ]
};

server = sinon.fakeServer.create();
server.autoRespond = true;
server.respondWith('GET', '/api/addresses',
  [200, {'Content-Type': 'application/json'}, JSON.stringify(database.addresses)]
);

// Model for Single Address
const Address = Backbone.Model.extend({
  defaults: {
    name: "",
    address: "",
    phoneNumber: ""
  }
});

// Collection for All Addresses
const Addresses = Backbone.Collection.extend({
  model: Address,
  url: "/api/addresses",
});

const addresses = new Addresses();

// View for One Address
const AddressView = Backbone.View.extend({
  model: new Address(),
  tagName: 'tr',
  initialize: function () {
    this.template = _.template($('.addresses-list-template').html());
  },
  events: {
    'click .delete-address': 'delete'
  },
  delete: function () {
    this.model.destroy();
    $('.address-input-row').show();
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
})

// View for All Addresses
const AddressesView = Backbone.View.extend({
  model: addresses,
  el: $('.addresses-list'),
  initialize: function () {
    this.model.on('add', this.onAddressAdd, this);
    this.model.on('remove', this.onAddressRemove, this);
  },
  onAddressAdd: function () {
    if (addresses.length >= 10) {
      $('.address-input-row').hide();
    }
    this.render();
  },
  onAddressRemove: function () {
    $('.address-input-row').show();
    this.render();
  },
  render: function () {
    let self = this;
    this.$el.html('');
    _.each(this.model.toArray(), function (address) {
      self.$el.append((new AddressView({model: address})).render().$el);
    })
  }
});

const addressesView = new AddressesView();

// Fetches Addresses stored in the mock server
addresses.fetch()

$(document).ready(function () {
  $('.add-address').on('click', function () {
    // Triggers error message if Phone Input Field does not pass Regex Pattern
    if ($('.phoneNumber-input').is(':invalid')) {
      // Toggles Error Display to visible
      $('.phoneNumberError').css('display', 'inline');
    } else {
      // Resets Error Display to invisible
      $('.phoneNumberError').css('display', 'none');
      // Creates new Model of Address
      const address = new Address({
        name: $('.name-input').val(),
        address: $('.address-input').val(),
        phoneNumber: $('.phoneNumber-input').val()
      });
      // Resets Input fields to be blank
      $('.name-input').val('');
      $('.address-input').val('');
      $('.phoneNumber-input').val('');
      // Adds New Address to current Collection
      addresses.add(address)
    }
  });
})