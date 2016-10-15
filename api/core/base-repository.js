class BaseRepository {

	constructor(model) {
		this.modelClass = model;
	}

	save(attributes) {
		var self = this;
		return this.modelClass.forge({id: attributes.id})
			.save(attributes)
			.then(function (model) {
				return self.findById(model.attributes.id);
			});
	}

	list(attributes, order) {
		return this.modelClass.collection()
			.query(this.createQuery(attributes, order))
			.fetch({ withRelated: this.modelClass.load })
			.then(function (models) {
				if (!models) {
					return [];
				}
				return models.toJSON();
			});
	}

	find(attributes) {
		return this.modelClass.forge(attributes)
			.fetch({ withRelated: this.modelClass.load })
			.then(function (model) {
				if (model) {
					return model.toJSON();
				}
				return null;
			});
	}

	findById(id) {
		return this.find({id: id});
	}

	remove(attributes) {
		return this.modelClass.forge(attributes)
			.destroy();
	}

	createQuery(attributes, order) {
		var filter = attributes? {where: attributes} : {};
		if (order) {
			filter.orderBy = [order.column, order.direction];
		}
		return filter;
	}

}

module.exports = BaseRepository;